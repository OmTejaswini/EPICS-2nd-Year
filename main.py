from cmath import inf
import copy
import sys
import ast

# input_data = '[],[],[5],[5],[],[2,3,8,9,10],[],[],[5],[5],[5],[],[],[],[],[],[],[],[],[]'
# input_data = sys.argv[1]
input_data = sys.stdin.readline().rstrip()
print(input_data,"input data")
# print("hello from python")
# input_data = sys.stdin.readline().rstrip()

lst = ast.literal_eval(input_data)
graph = [x if x else [] for x in lst]

while graph and not graph[-1]:
    graph.pop()



def greedyColoring(adj, V):
	
	result = [-1] * V
	result[0] = 0

	available = [False] * V

	for u in range(1, V):

		for i in adj[u]:
			if (result[i] != -1):
				available[result[i]] = True


		cr = 0
		while cr < V:
			if (available[cr] == False):
				break
			
			cr += 1
			
		result[u] = cr

		for i in adj[u]:
			if (result[i] != -1):
				available[result[i]] = False

	for u in range(V):
		print(u, result[u])

# Driver Code
if __name__ == '__main__':
	greedyColoring(graph,5)

# This code is contributed by mohit kumar 29
